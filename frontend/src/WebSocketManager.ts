
class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
  
    private constructor() {} 
  
    public static getInstance(): WebSocketManager {
      if (!WebSocketManager.instance) {
        WebSocketManager.instance = new WebSocketManager();
      }
      return WebSocketManager.instance;
    }
  
    public connect(url: string): void {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.socket = new WebSocket(url);
  
        this.socket.onopen = () => console.log('WebSocket connected');
        this.socket.onclose = () => console.log('WebSocket disconnected');
        this.socket.onerror = (error) => console.error('WebSocket error:', error);
      }
    }
  
    public disconnect(): void {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  
    public getSocket(): WebSocket | null {
      return this.socket;
    }
  }
  
  export default WebSocketManager;
  