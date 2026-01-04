import { MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Avatar, AvatarFallbackText } from './ui/avatar'
import { Button } from './ui/button'
import { HStack } from './ui/hstack' // ou Box/View com flex
import { Menu, MenuItem, MenuItemLabel } from './ui/menu'

export function ProfileButton() {
  return (
    <Menu
      placement="bottom right"
      offset={8}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps} variant="link">
            <Avatar className="size-10">
              <AvatarFallbackText>Jane Doe</AvatarFallbackText>
            </Avatar>
          </Button>
        )
      }}
    >
      {/* Perfil MenuItem */}
      <MenuItem>
        <Link href={'/'}>
          <HStack space="sm" className="items-center">
            <MaterialIcons name="settings" size={16} />
            <MenuItemLabel>Perfil</MenuItemLabel>
          </HStack>
        </Link>
      </MenuItem>

      {/* Sair MenuItem */}
      <MenuItem>
        <HStack space="sm" className="items-center">
          <MaterialIcons name="logout" size={16} />
          <MenuItemLabel>Sair</MenuItemLabel>
        </HStack>
      </MenuItem>
    </Menu>
  )
}
