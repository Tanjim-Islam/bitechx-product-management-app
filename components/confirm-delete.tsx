"use client";
import { useState } from "react";
import Modal from "./ui/modal";
import Button from "./ui/button";

export default function ConfirmDelete({ onConfirm, trigger }: { onConfirm: () => Promise<void> | void; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger ?? <Button variant="danger">Delete</Button>}</span>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold">Confirm delete</h3>
        <p className="mt-2 text-sm text-rich_black/70">This request simulates a delete and returns id. It does not remove from DB.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={async () => { await onConfirm(); setOpen(false); }}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}

