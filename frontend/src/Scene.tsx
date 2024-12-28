import { Center, Environment, Grid } from "@react-three/drei";
import { CameraControls } from "@react-three/drei";
import Avatar from "./components/Avatar";
import TeammateAvatar from "./components/TeammateAvatar";
import { useEffect, useState } from "react";

const Scene = () => {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://gather-town-3d.onrender.com");
  
    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
    };
  
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
  
      if (data.type === "update-users-state") {
        setUsers((prevUsers) => {
          const areEqual =
            JSON.stringify(prevUsers) === JSON.stringify(data.players);
          return areEqual ? prevUsers : data.players;
        });
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    ws.onclose = () => {
      console.log("WebSocket closed");
      setSocket(null);
    };
  
    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
    };
  }, []);
  

  
  return (
    <>
      <CameraControls
        fov={21}
        makeDefault={true}

        // maxPolarAngle={1.35}
        // minPolarAngle={1.35}
        // minDistance={0.5} // Set the minimum zoom distance
        // maxDistance={6.4} // Set the maximum zoom distance

        // }}
      />
      <Environment preset="city" />
      <Center>
        {socket && (
          <>
            <Avatar socket={socket} />

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
