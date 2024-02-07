import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  json,
  redirect,
  useFetcher,
  useFetchers,
  useLoaderData,
  useRevalidator,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import Api from "~/api";
import Spinner from "~/components/svgs/Spinner";
import { getApiToken, getProjectIdFromCookie } from "~/cookies.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Railway Conductor - Wallboard" },
    {
      name: "description",
      content: "Wallboard for displaying status of Railway project",
    },
  ];
};

type Service = {
  id: string;
  name: string;
  createdAt: string;
  projectId: string;
  environmentId: string;
  deployments: {
    edges: {
      node: {
        environmentId: string;
        createdAt: string;
        suggestAddServiceDomain: boolean;
        status: string;
        environment: {
          name: string;
        };
      };
    }[];
  };
};

type MainPageData = {
  project: {
    id: string;
    name: string;
  };
  services: Service[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const apiToken = await getApiToken(request);
  const projectId = await getProjectIdFromCookie(request);

  if (!apiToken || !projectId) {
    return redirect("/setup");
  }

  const { getAllProjects, servicesForProject } = Api(apiToken);

  const projectsRequest = getAllProjects();
  const servicesRequest = servicesForProject(projectId);

  const [projects, services] = await Promise.all([
    projectsRequest,
    servicesRequest,
  ]);

  return {
    services,
    project: projects.find((p) => p.id === projectId),
  };
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const projectId = await getProjectIdFromCookie(request);

  const { _action, serviceId } = Object.fromEntries(body);
  const api = Api(await getApiToken(request));

  if (_action === "delete-service") {
    await api.deleteService(serviceId.toString());
    return json({ serviceId });
  } else if (_action === "create-service") {
    const name = body.get("name")!;
    await api.createService(projectId, name.toString(), "nginx", {
      PORT: "80",
    });
    return json({ name });
  }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const ServiceCard = ({ service }: { service: Service }) => {
  const deleteServiceFetcher = useFetcher();
  const { state } = deleteServiceFetcher;
  const isDeleting = state === "loading" || state === "submitting";

  const deployment = service.deployments.edges[0]?.node;

  return (
    <div className="bg-slate-600 p-5 dark:text-white rounded-md flex h-full flex-col relative">
      {deployment && (
        <div className="flex space-x-2 my-2 justify-end top-1 right-1 absolute">
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {deployment.environment.name}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {deployment.status}
          </span>
        </div>
      )}
      <h2 className="text-3xl">{service.name}</h2>
      <div className="text-slate-400 text-xs">{service.id}</div>

      <div className="mt-auto flex items-baseline">
        <deleteServiceFetcher.Form
          className="mt-4"
          name="delete-service"
          method="post"
          action="/?index"
          key={`service-form-${service.name}`}
        >
          <input type="hidden" name="serviceId" value={service.id} />
          <button
            type="submit"
            name="_action"
            value="delete-service"
            className="underline text-red-400"
          >
            {isDeleting ? "Terminating..." : "Terminate Service"}
          </button>
        </deleteServiceFetcher.Form>

        <div className="ms-auto text-xs text-slate-400">
          created {dateFormatter.format(new Date(service.createdAt))}
        </div>
      </div>
    </div>
  );
};

const NewServiceCard = () => {
  const createProjectFetcher = useFetcher();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    submit(data, { navigate: false, method: "post" });

    formRef.current?.reset();
  };

  return (
    <div className="border border-dashed stroke-slate-300 p-5 dark:text-white rounded-md mt-4 max-w-lg m-auto">
      <h2 className="text-2xl text-center text-slate-300">Launch Service</h2>
      <createProjectFetcher.Form
        name="create-service"
        method="post"
        action="/?index"
        className="flex flex-col"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="_action" value="create-service" />
        <label htmlFor="name" className="block mt-4 text-slate-300">
          Service Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="eg. Soaring Phoenix"
          required
          className="bg-gray-50 rounded-lg border border-gray-300 text-gray-900 disabled:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block flex-1 text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label htmlFor="name" className="block mt-4 text-slate-300">
          Source
        </label>
        <select
          id="projectId"
          name="projectId"
          disabled
          className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="nginx">nginx base image</option>
        </select>
        <p className="m-2 text-center italic">
          For purposes of this exercise the source is hardcoded.
        </p>
        <button
          type="submit"
          value="create-service"
          className="w-full mt-2 text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:disabled:bg-primary-300 dark:bg-primary-600 dark:enabled:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Launch
        </button>
      </createProjectFetcher.Form>
    </div>
  );
};

export default function Index() {
  const { project, services } = useLoaderData<MainPageData>();
  const fetchers = useFetchers();

  const revalidator = useRevalidator();
  useEffect(() => {
    const interval = setInterval(() => {
      revalidator.revalidate();
    }, 1000 * 10); // 10 Seconds

    return () => clearInterval(interval);
  }, [revalidator]);

  return (
    <section className="dark:bg-slate-800 min-h-dvh">
      <section className="container mx-auto">
        <h1 className="py-4 text-4xl dark:text-white">
          {project.name}
          <Link
            to="/setup"
            className="text-sm ms-4 bg-slate-600 p-2 rounded-md align-middle"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white inline-block me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13v-2a1 1 0 0 0-1-1h-.8l-.7-1.7.6-.5a1 1 0 0 0 0-1.5L17.7 5a1 1 0 0 0-1.5 0l-.5.6-1.7-.7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.8l-1.7.7-.5-.6a1 1 0 0 0-1.5 0L5 6.3a1 1 0 0 0 0 1.5l.6.5-.7 1.7H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.8l.7 1.7-.6.5a1 1 0 0 0 0 1.5L6.3 19a1 1 0 0 0 1.5 0l.5-.6 1.7.7v.8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.8l1.7-.7.5.6a1 1 0 0 0 1.5 0l1.4-1.4a1 1 0 0 0 0-1.5l-.6-.5.7-1.7h.8a1 1 0 0 0 1-1Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </svg>
            Change Project
          </Link>
          <span className=" fill-primary-700 ms-2">
            {fetchers.filter((f) => f.state === "submitting").length > 0 && (
              <Spinner />
            )}
          </span>
        </h1>
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))}
        </div>
        <NewServiceCard />
      </section>
    </section>
  );
}
