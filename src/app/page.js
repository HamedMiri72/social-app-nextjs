

import CratePost from "@/components/CratePost";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const user = await currentUser();
  
  return (
    <div className='grid grid-cols-1 lg:grid-cols-10 gap-6'>

      <div className="lg:col-span-6">

        {user ? <CratePost/> : null}
        

      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">

        who to follow

      </div>


     
    </div>
  );
}
