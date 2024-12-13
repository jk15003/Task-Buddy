import {
  ClerkProvider,
} from '@clerk/nextjs'

const AuthLayout=({
  children,
}: {
  children: React.ReactNode
})=> {
  return (
    <ClerkProvider>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </ClerkProvider>
  );
};

export default AuthLayout;