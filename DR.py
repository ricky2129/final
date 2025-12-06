# routes.py  (cleaned)
import json
import os
import base64
from typing import List, Optional, Any, Dict

from datetime import datetime

from fastapi import APIRouter, Form, UploadFile, File, HTTPException, Body
from fastapi.responses import JSONResponse, FileResponse

# Local modules you provided — names preserved exactly as in your original file.
from models import DRScoreResponse, TextAnalysisRequest, ExternalAPIRequest, DownloadRequest
from file_utils import (
    encode_image_to_base64,
    process_iac_files,
    read_aws_inventory_file,
    fetch_aws_inventory_from_api,
)
from analysis_engine import (
    analyze_architecture_with_gpt40,
    create_analysis_response,
    analysis_results,
)
from report_generator import generate_pdf_report, generate_text_report
from config import DR_CRITERIA

router = APIRouter()


@router.post("/api/analyze-architecture", response_model=DRScoreResponse)
async def analyze_architecture(
    openai_api_key: str = Form(...),
    architecture_diagram: Optional[UploadFile] = File(None),
    iac_files: List[UploadFile] = File(default_factory=list),
    use_aws_inventory: bool = Form(False),
    aws_inventory_file_path: Optional[str] = Form(None),
    aws_inventory_api_url: Optional[str] = Form(None),
    api_headers: Optional[str] = Form(None),
    api_method: Optional[str] = Form("GET"),
    api_payload: Optional[str] = Form(None),
) -> JSONResponse:
    """
    Analyze architecture diagram and/or AWS inventory to generate DR readiness score.
    """

    try:
        image_base64: Optional[str] = None
        aws_inventory_content: str = ""

        # Validate that at least one input is provided
        if not architecture_diagram and not use_aws_inventory and not aws_inventory_api_url:
            raise HTTPException(
                status_code=400,
                detail="At least one input must be provided: architecture_diagram, use_aws_inventory=true, or aws_inventory_api_url",
            )

        # Process image if provided
        if architecture_diagram:
            if not architecture_diagram.content_type or not architecture_diagram.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Architecture diagram must be an image file")
            image_base64 = await encode_image_to_base64(architecture_diagram)

        # Process AWS inventory from file if requested
        if use_aws_inventory:
            if not aws_inventory_file_path:
                raise HTTPException(status_code=400, detail="aws_inventory_file_path must be provided when use_aws_inventory is true")
            try:
                aws_inventory_content = read_aws_inventory_file(aws_inventory_file_path)
                # debug/log
                # print(f"Successfully loaded AWS inventory from file: {len(aws_inventory_content)} characters")
            except FileNotFoundError as e:
                raise HTTPException(status_code=404, detail=str(e))

        # If an API URL is provided, fetch the inventory from the external API
        elif aws_inventory_api_url:
            # Parse headers and payload if provided (they are JSON strings)
            headers = None
            if api_headers:
                try:
                    headers = json.loads(api_headers)
                except json.JSONDecodeError:
                    raise HTTPException(status_code=400, detail="Invalid JSON format for api_headers")

            payload = None
            if api_payload:
                try:
                    payload = json.loads(api_payload)
                except json.JSONDecodeError:
                    raise HTTPException(status_code=400, detail="Invalid JSON format for api_payload")

            try:
                aws_inventory_content = await fetch_aws_inventory_from_api(
                    api_url=aws_inventory_api_url, headers=headers, method=api_method, payload=payload
                )
                # print(f"Successfully fetched AWS inventory from API: {len(aws_inventory_content)} characters")
            except HTTPException:
                raise  # re-raise HTTP exceptions
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch AWS inventory from API: {str(e)}")

        # Process IAC files (returns text)
        iac_content = await process_iac_files(iac_files) if iac_files else ""

        # Analyze with GPT-4o / GPT-40
        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=openai_api_key,
            image_base64=image_base64,
            iac_files_content=iac_content,
            aws_inventory_content=aws_inventory_content,
        )

        # Create standardized response
        response_obj, analysis_id = create_analysis_response(analysis)

        # Build response dict and attach metadata
        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        response_dict["data_sources"] = {
            "has_architecture_diagram": bool(architecture_diagram),
            "has_aws_inventory_file": bool(use_aws_inventory),
            "has_aws_inventory_api": bool(aws_inventory_api_url),
            "has_iac_files": bool(iac_files),
            "aws_inventory_length": len(aws_inventory_content),
            "iac_content_length": len(iac_content),
        }

        return JSONResponse(content=response_dict)

    except HTTPException:
        # Re-raise FastAPI HTTP exceptions untouched
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/api/analyze-text", response_model=DRScoreResponse)
async def analyze_text_inventory(request: TextAnalysisRequest) -> JSONResponse:
    """
    Analyze AWS inventory text content to generate DR readiness score
    """
    try:
        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=request.openai_api_key,
            image_base64=None,
            iac_files_content=request.iac_files_content or "",
            aws_inventory_content=request.aws_inventory_content or "",
        )

        response_obj, analysis_id = create_analysis_response(analysis)
        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        return JSONResponse(content=response_dict)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")


@router.post("/api/analyze-from-external-api", response_model=DRScoreResponse)
async def analyze_from_external_api(request: ExternalAPIRequest) -> JSONResponse:
    """
    Analyze AWS inventory from an external API to generate DR readiness score
    """
    try:
        # Fetch AWS inventory from external API
        aws_inventory_content = await fetch_aws_inventory_from_api(
            api_url=request.api_url,
            headers=request.api_headers,
            method=request.api_method,
            payload=request.api_payload,
        )
        # print(f"Fetched {len(aws_inventory_content)} characters from external API")

        # Analyze with GPT-4o using external API content
        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=request.openai_api_key,
            image_base64=None,
            iac_files_content=request.iac_files_content or "",
            aws_inventory_content=aws_inventory_content,
        )

        response_obj, analysis_id = create_analysis_response(analysis)

        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        response_dict["data_sources"] = {
            "api_url": request.api_url,
            "api_method": request.api_method,
            "aws_inventory_length": len(aws_inventory_content),
            "iac_content_length": len(request.iac_files_content or ""),
        }
        return JSONResponse(content=response_dict)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"External API analysis failed: {str(e)}")


@router.post("/api/analyze")
async def analyze_file_list(request: Dict[str, Any]) -> JSONResponse:
    """
    Simple endpoint to analyze file lists for DR readiness.
    Expects JSON with file lists: infrastructure_files, database_files, security_files, recovery_files
    """
    try:
        infrastructure_files = request.get("infrastructure_files", [])
        database_files = request.get("database_files", [])
        security_files = request.get("security_files", [])
        recovery_files = request.get("recovery_files", [])

        # Create a text inventory from the file lists
        inventory_content = f"""
Infrastructure Files:
{chr(10).join(f"- {file}" for file in infrastructure_files)}

Database Files:
{chr(10).join(f"- {file}" for file in database_files)}

Security Files:
{chr(10).join(f"- {file}" for file in security_files)}

Recovery Files:
{chr(10).join(f"- {file}" for file in recovery_files)}
"""

        # Analyze with GPT-4o using the text inventory
        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),  # if you want to default to env key
            image_base64=None,
            iac_files_content="",
            aws_inventory_content=inventory_content,
        )

        response_obj, analysis_id = create_analysis_response(analysis)
        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        response_dict["data_sources"] = {
            "infrastructure_files_count": len(infrastructure_files),
            "database_files_count": len(database_files),
            "security_files_count": len(security_files),
            "recovery_files_count": len(recovery_files),
        }
        return JSONResponse(content=response_dict)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File list analysis failed: {str(e)}")


@router.post("/api/analyze-file-upload", response_model=DRScoreResponse)
async def analyze_file_upload(
    openai_api_key: str = Form(...),
    aws_inventory_file: Optional[UploadFile] = File(None),
    architecture_diagram: Optional[UploadFile] = File(None),
    iac_files: List[UploadFile] = File(default_factory=list),
) -> JSONResponse:
    """
    Analyze uploaded files for DR readiness.
    Supports:
      - aws_inventory_file: .txt or .json
      - architecture_diagram: image files
      - iac_files: list of infrastructure-as-code files
    """
    try:
        aws_inventory_content = ""
        iac_content = ""
        image_base64: Optional[str] = None

        # Validate that at least one file is provided
        if not aws_inventory_file and not architecture_diagram and not iac_files:
            raise HTTPException(
                status_code=400,
                detail="At least one file must be provided: aws_inventory_file, architecture_diagram, or iac_files",
            )

        # Process architecture diagram
        if architecture_diagram:
            allowed_image_extensions = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
            if not architecture_diagram.filename.lower().endswith(allowed_image_extensions):
                raise HTTPException(
                    status_code=400,
                    detail=f"Architecture diagram must be an image file: {', '.join(allowed_image_extensions)}",
                )
            image_bytes = await architecture_diagram.read()
            image_base64 = base64.b64encode(image_bytes).decode("utf-8")
            # print(f"Uploaded architecture diagram: {architecture_diagram.filename}, size: {len(image_bytes)} bytes")

        # Process AWS inventory file if provided
        if aws_inventory_file:
            if not aws_inventory_file.filename.lower().endswith((".txt", ".json")):
                raise HTTPException(status_code=400, detail="AWS inventory file must be txt or json format")
            content_bytes = await aws_inventory_file.read()
            aws_inventory_content = content_bytes.decode("utf-8")
            # print(f"Uploaded AWS inventory file: {aws_inventory_file.filename}, size: {len(aws_inventory_content)} characters")

        # Process IAC files
        iac_content = await process_iac_files(iac_files) if iac_files else ""

        # Analyze with GPT-4o
        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=openai_api_key,
            image_base64=image_base64,
            iac_files_content=iac_content,
            aws_inventory_content=aws_inventory_content,
        )

        response_obj, analysis_id = create_analysis_response(analysis)
        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        response_dict["data_sources"] = {
            "architecture_diagram": architecture_diagram.filename if architecture_diagram else None,
            "aws_inventory_file": aws_inventory_file.filename if aws_inventory_file else None,
            "aws_inventory_size": len(aws_inventory_content),
            "iac_files_count": len(iac_files),
            "iac_content_size": len(iac_content),
        }
        return JSONResponse(content=response_dict)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload analysis failed: {str(e)}")


@router.get("/api/analyze-aws-inventory")
async def analyze_aws_inventory_file(aws_inventory_file_path: Optional[str] = None, openai_api_key: str = Form(...)) -> JSONResponse:
    """
    Analyze AWS inventory from file to generate DR readiness score.
    """
    try:
        if not aws_inventory_file_path:
            raise HTTPException(status_code=400, detail="aws_inventory_file_path is required")

        aws_inventory_content = read_aws_inventory_file(aws_inventory_file_path)

        analysis = await analyze_architecture_with_gpt40(
            openai_api_key=openai_api_key,
            image_base64=None,
            iac_files_content="",
            aws_inventory_content=aws_inventory_content,
        )

        response_obj, analysis_id = create_analysis_response(analysis)
        response_dict = response_obj.model_dump()
        response_dict["analysis_id"] = analysis_id
        return JSONResponse(content=response_dict)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AWS inventory analysis failed: {str(e)}")


@router.get("/api/data-sources")
async def get_data_sources() -> JSONResponse:
    """
    Get information about available data sources for analysis.
    """
    default_file_exists = False
    try:
        read_aws_inventory_file()  # call without path to check default location (if your helper supports it)
        default_file_exists = True
    except FileNotFoundError:
        default_file_exists = False
    except Exception:
        default_file_exists = False

    return JSONResponse(content={"default_aws_inventory_exists": default_file_exists})


@router.post("/api/download-report/")
async def download_report(request: DownloadRequest) -> Any:
    """
    Download analysis report in specified format (json, text, pdf).
    """
    analysis_id = request.analysis_id
    analysis_data = request.analysis_data
    fmt = request.format.lower() if request.format else "json"

    try:
        if fmt == "json":
            filename = f"dr_analysis_{analysis_id}.json"
            return JSONResponse(content=analysis_data, headers={"Content-Disposition": f'attachment; filename="{filename}"'})

        elif fmt == "text":
            filepath = generate_text_report(analysis_data, analysis_id)
            filename = f"dr_analysis_{analysis_id}.txt"
            return FileResponse(filepath, media_type="text/plain", filename=filename, headers={"Content-Disposition": f'attachment; filename="{filename}"'})

        elif fmt == "pdf":
            filepath = generate_pdf_report(analysis_data, analysis_id)
            filename = f"dr_analysis_{analysis_id}.pdf"
            return FileResponse(filepath, media_type="application/pdf", filename=filename, headers={"Content-Disposition": f'attachment; filename="{filename}"'})

        else:
            raise HTTPException(status_code=400, detail="Invalid format. Supported formats: json, text, pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@router.get("/api/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@router.get("/api/criteria")
async def get_dr_criteria() -> JSONResponse:
    """Get DR scoring criteria"""
    return JSONResponse(content={"criteria": DR_CRITERIA})