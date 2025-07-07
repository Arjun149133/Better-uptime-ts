import { Button } from "../ui/button";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className=" fixed top-0 left-0 w-full z-50 bg-custom-bg/90 backdrop-blur-sm">
      <div className=" flex justify-center items-center h-12">
        <div className="flex justify-between xl:w-3/4 border-b border-white/20 py-1 mx-1 xl:mx-0">
          <div className=" flex lg:gap-2 gap-1 ">
            <div className=" flex items-center mx-2">
              <Logo />
            </div>
            <Button variant={"custom"} className="">
              Home
            </Button>
            <Button variant={"custom"} className="">
              Features
            </Button>
            <Button variant={"custom"} className="">
              Pricing
            </Button>
            <Button variant={"custom"} className="">
              About
            </Button>
            <Button variant={"custom"} className="">
              Contact
            </Button>
          </div>
          <div>
            <Button variant={"custom"} className="">
              Sign In
            </Button>
            <Button
              variant={"auth"}
              className=" from-[#606adb] to-[#4b5ce6] hover:brightness-125 h-6 w-16 p-1 text-sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
