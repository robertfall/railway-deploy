import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Await,
  defer,
  json,
  redirect,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Suspense, useCallback, useRef } from "react";
import Api from "~/api";
import Spinner from "~/components/svgs/Spinner";
import {
  apiTokenCookieFactory,
  getApiToken,
  projectIdCookieFactory,
} from "~/cookies.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Railway - Project Wallboard" },
    {
      name: "description",
      content: "Wallboard for displaying status of Railway project",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiToken = await getApiToken(request);

  console.log(apiToken);

  if (apiToken) {
    const projects = Api(apiToken.toString()).getAllProjects();
    return defer({ apiToken, projects });
  }

  return { apiToken, projects: null };
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const { _action, apiToken, projectId } = Object.fromEntries(body);

  if (_action === "set-api-token") {
    const projects = await Api(apiToken.toString()).getAllProjects();
    return json(
      { apiToken, projects },
      {
        headers: {
          "Set-Cookie": await apiTokenCookieFactory.serialize(apiToken),
        },
      }
    );
  } else if (_action === "clear-cookies") {
    const apiTokenCookie = await apiTokenCookieFactory.serialize(null, {
      expires: new Date(0),
    });

    console.log("API Token Cookie", apiTokenCookie);
    const projectIdCookie = await projectIdCookieFactory.serialize(null, {
      expires: new Date(0),
    });

    const headers = new Headers();
    headers.append("Set-Cookie", apiTokenCookie);
    headers.append("Set-Cookie", projectIdCookie);

    return json({}, { headers });
  } else if (_action === "set-project") {
    const cookie = await projectIdCookieFactory.serialize(projectId.toString());
    return redirect("/", { headers: { "Set-Cookie": cookie } });
  }
}

export default function Index() {
  const { apiToken, projects } = useLoaderData<typeof loader>();

  const apiTokenFetcher = useFetcher();
  const { state } = apiTokenFetcher;
  const apiTokenBusy = state === "submitting" || state === "loading";

  const apiTokenInput = useRef<HTMLInputElement>(null);
  const clearForm = useCallback(() => {
    if (apiTokenInput.current) {
      apiTokenInput.current.value = "";
    }
  }, [apiTokenInput]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Railway Project Wallboard
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-gray-600 dark:text-gray-400">
              You&apos;ll need to provide some infomation to get started using
              the wallboard.
            </p>
            <apiTokenFetcher.Form
              className="space-y-4 md:space-y-6"
              name="api-token-form"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your API Token from Railway
                </label>
                <div className="flex space-x-1">
                  <input
                    type="password"
                    name="apiToken"
                    id="api-token"
                    disabled={!!apiToken}
                    defaultValue={apiToken}
                    ref={apiTokenInput}
                    required
                    className=" bg-gray-50 rounded-lg border border-gray-300 text-gray-900 disabled:text-gray-500 focus:ring-blue-500 focus:border-blue-500 block flex-1 text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:disabled:text-slate-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {apiToken ? (
                    <button
                      className="inline-flex space-x-2 text-white rounded-lg bg-red-500 items-center px-3 text-sm border border-s-0 border-gray-300 dark:border-gray-600"
                      type="submit"
                      name="_action"
                      value="clear-cookies"
                      onClick={() => clearForm()}
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      type="submit"
                      name="_action"
                      value="set-api-token"
                      className="inline-flex space-x-2 text-white rounded-lg bg-action-500 items-center px-3 text-sm border border-s-0 border-gray-300 dark:border-gray-600"
                    >
                      {apiTokenBusy ? (
                        <div
                          role="status"
                          className=" text-white fill-action-600"
                        >
                          <Spinner />
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-[24px] h-[24px block"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.6 3h.8l7 2.7c.3.2.6.6.6 1a17.7 17.7 0 0 1-7.4 14.1 1 1 0 0 1-1.2 0A17.4 17.4 0 0 1 4 6.7c0-.4.3-.8.6-1l7-2.6Zm4 7.3a1 1 0 0 0-1.3-1.6l-3.3 3-.8-1a1 1 0 0 0-1.4 1.5l1.5 1.5c.4.4 1 .4 1.4 0l4-3.4Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>Verify</div>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </apiTokenFetcher.Form>
            <form name="dashboard-form" method="POST">
              <fieldset className="space-y-4 md:space-y-6" disabled={!apiToken}>
                <label
                  htmlFor="projectId"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  The project you want to display:
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <Suspense fallback={<option>Loading...</option>}>
                    <Await resolve={projects}>
                      {(ps) =>
                        ps?.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))
                      }
                    </Await>
                  </Suspense>
                </select>

                <button
                  type="submit"
                  name="_action"
                  value="set-project"
                  className="w-full text-white bg-primary-600 enabled:hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:disabled:bg-primary-300 dark:bg-primary-600 dark:enabled:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Load Dashboard
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
