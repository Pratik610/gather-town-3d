import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect} from "react";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../actions/userActions";
import { useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import { getAllWorkSpace } from "@/actions/workspaceAction";
import Loader from "@/components/Loader";
import WebSocketManager from "@/WebSocketManager";
import CreateWorkspacePopup from "@/components/CreateWorkspacePopup";

const DashboardScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const wsManager = WebSocketManager.getInstance();
  const navigate = useNavigate();

  const userDetails = useSelector((state: any) => state.userDetails);
  const { details, error } = userDetails;

  const workspaceDetails = useSelector((state: any) => state.workspaceDetails);
  const { workspaces, loading } = workspaceDetails;

  const socket = wsManager.getSocket();

  useEffect(() => {
    if (!details) {
      dispatch(getUserDetails());
      dispatch(getAllWorkSpace());
    }
  }, [details, dispatch]);

  useEffect(() => {
    wsManager.connect("ws://localhost:5000");
  }, [wsManager]);

  useEffect(() => {
    if (socket) {
      socket!.onmessage = (message) => {
        const data = JSON.parse(message.data);
        navigate(`/playground/${data.workspaceId}`);
      };
    }
  }, [socket,navigate]);

  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (!details) {
    return (
      <div role="status" className="  flex h-dvh justify-center items-center">
        <Loader />
      </div>
    );
  }

  const joinWorkSpace = (workspaceId: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      const data = {
        type: "join-workspace",
        workspaceId,
        userDetails: details,
      };

      socket.send(JSON.stringify(data));
    }
  };

  return (
    <SidebarProvider className="font-geist">
      <AppSidebar active={"Dashboard"} />
      <SidebarInset>
        <header className="flex justify-between items-center h-16 shrink-0  gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <div className="w-64">
            <NavUser
              user={{
                name: details?.name,
                email: details?.email,
                avatar: details?.profilePhoto,
              }}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex h-4/5 flex-col items-center justify-center gap-6 pb-6 md:p-10">
            <Loader />
          </div>
        ) : workspaces.length <= 0 ? (
          <div className="flex h-4/5 flex-col items-center justify-center gap-6 pb-6 md:p-10">
            <h1 className="text-2xl font-medium ">No Workspace Found</h1>
            <CreateWorkspacePopup />
          </div>
        ) : (
          <div className="container p-4 mx-auto mt-5">
            <div className="flex justify-between pb-4 border-b  border-zinc-800 pe-4">
              <h1 className="text-2xl font-medium ">My Workspaces </h1>
              <CreateWorkspacePopup />
            </div>

            <div className="grid mt-4 lg:grid-cols-3 xl:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-4  ">
              {workspaces &&
                workspaces.length > 0 &&
                workspaces.map((item: any) => (
                  <div
                  key={item.workspace.id}
                    onClick={() => joinWorkSpace(item.workspace.id)}
                    className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg  aspect-video flex items-center justify-center"
                  >
                    {item.workspace.name}
                  </div>
                ))}
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardScreen;
