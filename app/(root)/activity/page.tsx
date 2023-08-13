import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// import PostThread from "@/components/forms/PostThread";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  // get Activity
  const activity = await getActivity(userInfo._id)
  return (
    <section>
      <h1 className="head-text">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {
          activity.length > 0 ?(
            <>
            {
              activity.map((activity) => {
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image src={activity.author.image} alt="profile pic" width={20} height={20} className="rounded-full"/>
                  </article>
                </Link>
              })
            }
            </>
          ) : (<p className="text-base-regular text-light-2">No Activity Yet</p>)
        }
      </section>
    </section>
  );
}
export default Page;
