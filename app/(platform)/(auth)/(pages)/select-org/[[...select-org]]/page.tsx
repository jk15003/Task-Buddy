import { OrganizationList } from "@clerk/nextjs";

export const runtime="edge";

export default function CreateOrganizationPage(){
    return(
        <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={"/organization/:id"}
        afterSelectOrganizationUrl={"/organization/:id"}/>
    );
}