import { Center, Environment, Grid } from "@react-three/drei";
import Avatar from "./Avatar";
import TeammateAvatar from "./TeammateAvatar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import WebSocketManager from "@/WebSocketManager";
const Scene = ({ users, setUsers }: any) => {
  const navigate = useNavigate();

  const userDetails = useSelector((state: any) => state.userDetails);
  const { details } = userDetails;

  const wsManager = WebSocketManager.getInstance();
  const socket = wsManager.getSocket();

  useEffect(() => {
    if (!socket) {
      navigate(`/`);
    }
  }, [navigate, socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.type === "update-users") {
          console.log(data);

          setUsers((prevUsers: any) => {
            const areEqual =
              JSON.stringify(prevUsers) === JSON.stringify(data.players);
            return areEqual ? prevUsers : data.players;
          });
        }
      };
    }
  }, [socket]);

  return (
    <>
      <Environment preset="city" />
      <Center>
        {socket && (
          <>
            <Avatar socket={socket} details={details} />

            {users &&
              users.map((player: any) => (
                <TeammateAvatar key={player.id} player={player} />
              ))}
          </>
        )}

        <Grid
          cellColor={"#6f6f6f"}
          cellSize={0.1}
          infiniteGrid={true}
          sectionColor={"#9d4b4b"}
        />
      </Center>
    </>
  );
};

export default Scene;
