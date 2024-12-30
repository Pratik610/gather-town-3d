import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createWorkSpace, getAllWorkSpace } from "@/actions/workspaceAction";

import { useSelector, useDispatch } from "react-redux";
const CreateWorkspacePopup = () => {
  const dispatch: AppDispatch = useDispatch();

  const workspaceCreate = useSelector((state: any) => state.workspaceCreate);
  const { workspaceStatus, loading: workspaceCreateLoading } = workspaceCreate;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (workspaceStatus) {
      dispatch({
        type: "WORKSPACE_CREATE_RESET",
      });
      dispatch(getAllWorkSpace());
    }
  }, [workspaceStatus]);

  const create = () => {
    try {
      dispatch(createWorkSpace(name, description));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={workspaceStatus && true}>
      <DialogTrigger asChild>
        <Button>Create Workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create WorkSpace</DialogTitle>
          <DialogDescription>
            invite you friends and collaborate
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={create}
            disabled={workspaceCreateLoading}
          >
            {workspaceCreateLoading && (
              <div
                className="animate-spin inline-block size-4 border-[2px] border-current border-t-transparent text-zinc-800 rounded-full dark:text-zinc-800"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspacePopup;
