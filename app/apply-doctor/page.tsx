
import { DoctorApplyForm } from "@/components/form/dotor-apply-form";
import Logo from "@/components/ui/logo";


export default function ApplyDoctorPage() {
      return (
            <div className="bg-secondary p-6 md:p-10 w-full">
                  <Logo className="mt-2" imageClassName="w-fit h-12" />
                  <div className="flex min-h-svh flex-col items-center justify-center ">

                        <div className="w-full max-w-sm md:max-w-5xl">
                           <DoctorApplyForm/>
                        </div>
                  </div>
            </div>
      )
}
