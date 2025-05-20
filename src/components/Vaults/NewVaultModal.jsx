import { Button, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import React from 'react'
import NewCollabVaultForm from './NewCollabVault'

export default function NewVaultModal({children, type, open, setOpen}) {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body>
              <NewCollabVaultForm onDone={() => {
                setOpen(false)
              }} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
