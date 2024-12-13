import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/Navbar";

const DashboardLayout=({children}:{
    children:React.ReactNode;
    })=>{
        return(
            <div className="h-full">
                <ClerkProvider
                appearance={{
                    baseTheme: undefined
                  }}
                  signInFallbackRedirectUrl="/sign-in">
                <Navbar/>
                {children}
                </ClerkProvider>
            </div>
        );
};
export default DashboardLayout;