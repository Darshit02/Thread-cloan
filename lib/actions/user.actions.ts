"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { getJsPageSizeInKb } from "next/dist/build/utils";
import { SortOrder } from "mongoose";
import { FilterQuery } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user : ${error.message}`);
  }
}
export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path : 'communities',
    //   model; Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch User : ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // find all threads ahtord by user with the given id

    // TODO : populate community

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to get user posts : ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        { 
          username: { $regex: regex } 
        },
        {
          name: { $regex: regex },
        },
      ];
    }
  const sortOptions = { createdAt:sortBy}
  const userQuery = User.find(query)
  .sort(sortOptions)
  .skip(skipAmount)
  .limit(pageSize)
  const totleUserCount = await User.countDocuments(query)
  const users = await userQuery.exec()
  const isNext = totleUserCount > skipAmount + users.length
  return { users,isNext}
  } catch (error:any) {
throw new Error (`some error occured : ${error.message}`)
  }
}

export async function getActivity(userId: string) {
  try {
    const userThreads = await Thread.find({author:userId})
    
    
    const childThreadIds = userThreads.reduce((acc , userThread) =>{
      return acc.concat(userThread.children)
    },[])
    const replies = await Thread.find({
      _id : { $in : childThreadIds } ,
      author : { $ne : userId }
    }).populate({
      path :'author' ,
      model : User,
      select : 'name image _id'
    })
    return replies
  } catch (error:any) {
    throw new Error(`Failed to fetch Activity : ${error.message}`)
  }
}