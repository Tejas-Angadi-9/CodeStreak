import React, { useState, useCallback } from "react";
import { ArrowIcon, HomeIcon, LinkIcon } from "./components/RoomIcons";

function Room() {
  const [roomCode, setRoomCode] = useState<string>("");

  const handleCreateRoom = useCallback(() => {
    console.log("Creating a new room...");
  }, []);

  const handleJoinRoom = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (roomCode.trim()) {
        console.log(`Joining room with code: ${roomCode}`);
      }
    },
    [roomCode],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setRoomCode(event.target.value);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans flex flex-col items-center justify-start p-6 select-none">
      <div className="w-full max-w-md mt-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Hey Tejas!</h1>
          <p className="text-neutral-content/60 text-sm mt-2">
            Start a new room or jump into one
          </p>
        </header>

        <div className="w-full rounded-3xl bg-gradient-to-b from-create-card-start to-create-card-end border border-create-card-border p-6 mb-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-12 h-12 bg-gradient-to-b from-create-icon-start to-create-icon-end rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 mb-5">
            <HomeIcon />
          </div>

          <h2 className="text-xl font-bold tracking-wide mb-2">
            Create a Room
          </h2>
          <p className="text-neutral-content/70 text-sm leading-relaxed mb-6">
            Start fresh. Get a unique code and invite your friend to keep each
            other accountable.
          </p>

          <button
            onClick={handleCreateRoom}
            className="btn btn-primary w-full sm:w-auto px-6 rounded-xl font-bold border-none bg-gradient-to-r from-create-icon-start to-create-icon-end text-primary-content shadow-md shadow-orange-950/50 normal-case group">
            Create Room
            <ArrowIcon />
          </button>
        </div>

        <div className="divider text-neutral-content/40 text-xs font-semibold uppercase tracking-wider my-4">
          or
        </div>

        <div className="w-full rounded-3xl bg-gradient-to-b from-join-card-start to-join-card-end border border-join-card-border p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

          <div className="w-12 h-12 bg-gradient-to-b from-join-icon-start to-join-icon-end rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-5">
            <LinkIcon />
          </div>

          <h2 className="text-xl font-bold tracking-wide mb-2">Join a Room</h2>
          <p className="text-neutral-content/70 text-sm leading-relaxed mb-6">
            Got a code from your friend? Enter it below to start tracking
            together.
          </p>

          <form
            onSubmit={handleJoinRoom}
            className="w-full flex items-center bg-base-200 border border-join-form-border rounded-xl p-1.5 focus-within:border-secondary/50 transition-colors">
            <div className="flex items-center pl-3 flex-grow gap-2">
              <span role="img" aria-label="key" className="text-sm select-none">
                🔑
              </span>
              <input
                type="text"
                placeholder="Room code e.g. CS-X7K2"
                value={roomCode}
                onChange={handleInputChange}
                className="w-full bg-transparent text-sm focus:outline-none placeholder-neutral-content/30 text-base-content"
              />
            </div>

            <button
              type="submit"
              disabled={!roomCode.trim()}
              className="btn btn-sm btn-secondary rounded-lg font-bold text-sm h-9 min-h-0 px-5 normal-case text-secondary-content border-none">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Room;
