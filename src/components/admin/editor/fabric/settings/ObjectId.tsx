import React from "react";

export function ObjectId({ objectId }: { objectId: string }) {
  return (
    <>
      <label>객체 ID</label>
      <input type="text" value={objectId} readOnly />
    </>
  );
}
