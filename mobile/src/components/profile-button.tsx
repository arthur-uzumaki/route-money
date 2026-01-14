import { MaterialIcons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { Text } from 'react-native'
import { useAuth } from '~/hooks/use-auth-hook'
import { Avatar, AvatarFallbackText } from './ui/avatar'
import { Button } from './ui/button'
import { HStack } from './ui/hstack' // ou Box/View com flex
import { Menu, MenuItem, MenuItemLabel } from './ui/menu'

export function ProfileButton() {
  const { signOut } = useAuth()
  const route = useRouter()

  async function handleSignOut() {
    await signOut()
    route.replace('/signin')
  }

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
      <MenuItem textValue="perfil">
        <Link href={'/'}>
          <HStack space="sm" className="items-center">
            <MaterialIcons name="settings" size={16} />
            <MenuItemLabel>Perfil</MenuItemLabel>
          </HStack>
        </Link>
      </MenuItem>

      {/* Sair MenuItem */}
      <MenuItem textValue="sair">
        <MenuItemLabel onPress={handleSignOut}>
          <HStack space="sm" className="items-center">
            <MaterialIcons name="logout" size={16} />
            <Text>Sair</Text>
          </HStack>
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  )
}
