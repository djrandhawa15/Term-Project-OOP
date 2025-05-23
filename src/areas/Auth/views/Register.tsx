import { Error } from "./ErrorBox";

type Props = {
  error: string;
};

export function Register({ error }: Props) {
  return (
    <div className="bg-white font-family-karla h-screen">
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-12">
            <a href="#" className="bg-black text-white font-bold text-xl p-4">
              devHouse
            </a>
          </div>

          <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
            <p className="text-center text-3xl mb-6">Register</p>
            <form
              className="flex flex-col pt-3 md:pt-8"
              method="post"
              action="/auth/register"
            >

              {error && <Error>{error}</Error>}
              
              <div className="flex flex-col pt-4">
                <label htmlFor="fName" className="text-lg">
                  First Name
                </label>
                <input
                  type="text"
                  id="fName"
                  name="fName"
                  placeholder="John"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
 
              <div className="flex flex-col pt-4">
                <label htmlFor="lName" className="text-lg">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lName"
                  name="lName"
                  placeholder="Doe"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="flex flex-col pt-4">
                <label htmlFor="username" className="text-lg">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="User123"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="flex flex-col pt-4">
                <label htmlFor="email" className="text-lg">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="flex flex-col pt-4">
                <label htmlFor="password" className="text-lg">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <input
                type="submit"
                value="Register"
                className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8 cursor-pointer"
              />
            </form>
            <div className="text-center pt-12 pb-12">
              <p>
                Already have an account?&nbsp;
                <a href="/auth/login" className="underline font-semibold">
                  Login here.
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 shadow-2xl">
          <img
            className="object-cover w-full h-screen hidden md:block"
            src="https://images.unsplash.com/photo-1549707523-fe7b18f2e172?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Developer workspace"
          />
        </div>
      </div>
    </div>
  );
}