import {useEffect, useState} from 'react'
import axios from 'axios';
import {Project} from "interface/project";

export const useProject = (slug: string) => {
    const [project, setProject] = useState<Project>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [apiError, setApiError] = useState();

    useEffect(() => {
        const fetchProject = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios.get(`/view/project/${slug}`);
                setProject(result.data);
            } catch (error: any) {
                setIsError(true);
                setApiError(error);
            }

            setIsLoading(false);
        };

        fetchProject();
    }, [slug]);

    return {project, isLoading, isError, apiError};
}
