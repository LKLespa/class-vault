import { Menu, Popover, Portal } from '@chakra-ui/react'
import React from 'react'

export default function CreateVaultMenu({ children, open, setOpen }) {
    return (
        <Menu.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Menu.Trigger asChild>
                {children}
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="class-room">New ClassRoom</Menu.Item>
                        <Menu.Item value="class-vault">New ClassVault</Menu.Item>
                        <Menu.Item value="collab-vault">New CollabVault</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}
