<<<<<<< HEAD
import { useMutation, useQuery } from "@tanstack/react-query";
import useTraceAssistService from "services/traceassist.service";

import {
  CreateDeploymentRequest,
  Deployment,
  AnalyzeRepoRequest,
  AnalyzeRepoResponse,
} from "../interfaces/traceAssist";
=======
import { useQuery, useMutation } from "@tanstack/react-query";
import useTraceAssistService from "services/traceassist.service";
import { Deployment } from "../interfaces/traceAssist";
>>>>>>> f0ce0ac (das)

function extractErrorMessage(error: any): string {
  if (error?.response?.data) {
    if (typeof error.response.data === "string") {
      return error.response.data;
    }
    if (error.response.data.detail) {
      return error.response.data.detail;
    }
    if (error.response.data.message) {
      return error.response.data.message;
    }
    return "An error occurred. Please try again.";
  }
  if (error?.message) {
    return error.message;
  }
  return "An unknown error occurred.";
}

<<<<<<< HEAD
export function useCreateDeployment() {
  const { createDeployment } = useTraceAssistService();

  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: async (obj: CreateDeploymentRequest) => {
      try {
        return await createDeployment(obj);
      } catch (error: any) {
        throw new Error(extractErrorMessage(error));
      }
    },
  });

  return {
    mutateAsync,
    isError,
    error,
    isLoading: isPending,
  };
}

export function useGetDeploymentDetails(deploymentName: string) {
  const { getDeploymentDetails } = useTraceAssistService();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["deployment-details", deploymentName],
    queryFn: () => getDeploymentDetails(deploymentName),
    enabled: !!deploymentName,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}

export function useInstrumentDeployment() {
  const { instrumentDeployment } = useTraceAssistService();

  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: async (deploymentName: string) => {
      try {
        return await instrumentDeployment(deploymentName);
      } catch (error: any) {
        throw new Error(extractErrorMessage(error));
      }
    },
  });

  return {
    mutateAsync,
    isError,
    error,
    isLoading: isPending,
  };
}

=======
/**
 * React Query hook to fetch all deployments for a given project and application.
 */
>>>>>>> f0ce0ac (das)
export function useGetAllDeployments(project_id: string, application_id: string) {
  const { getAllDeployments } = useTraceAssistService();

  const { data, isLoading, isError, refetch } = useQuery<Deployment[]>({
    queryKey: ["all-deployments", project_id, application_id],
    queryFn: () => getAllDeployments(project_id, application_id),
    enabled: !!project_id && !!application_id,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}

<<<<<<< HEAD
export function useAnalyzeRepo() {
  const { analyzeRepo } = useTraceAssistService();

  const { mutateAsync, isError, error, isPending, data } = useMutation({
    mutationFn: async (req: AnalyzeRepoRequest) => {
      try {
        return await analyzeRepo(req);
=======
/**
 * React Query mutation hook to start instrumentation for a deployment.
 */
export function useInstrumentDeployment() {
  const { instrumentDeployment } = useTraceAssistService();

  return useMutation({
    mutationFn: async ({
      deployment_name,
      namespace,
    }: {
      deployment_name: string;
      namespace: string;
    }) => {
      try {
        return await instrumentDeployment(deployment_name, namespace);
>>>>>>> f0ce0ac (das)
      } catch (error: any) {
        throw new Error(extractErrorMessage(error));
      }
    },
  });
<<<<<<< HEAD

  return {
    mutateAsync,
    isError,
    error,
    isLoading: isPending,
    data,
  };
}

export function useDeleteDeployment() {
  const { deleteDeployment } = useTraceAssistService();

  const { mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: async (deploymentName: string) => {
      try {
        return await deleteDeployment(deploymentName);
=======
}

/**
 * React Query mutation hook to trigger OTEL stack installation.
 */
export function useSetupOtelComponents() {
  const { setupOtelComponents } = useTraceAssistService();

  return useMutation({
    mutationFn: async () => {
      try {
        return await setupOtelComponents();
>>>>>>> f0ce0ac (das)
      } catch (error: any) {
        throw new Error(extractErrorMessage(error));
      }
    },
  });
<<<<<<< HEAD

  return {
    mutateAsync,
    isError,
    error,
    isLoading: isPending,
  };
=======
>>>>>>> f0ce0ac (das)
}
