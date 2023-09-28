import NavigationBar from '../../components/layout/Navbar'
import ProfilePage from '../../components/profile/ProfilePage'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect, usePathname } from 'next/navigation'

export default async function Username ({ params }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/')
  }

  //prendo l'username per creare la pagina profilo
  var profile = params.username[0]
  var loggedUserInfo = null

  console.log('YOSHI? ' + profile)

  try {
    if (!loggedUserInfo) {
      loggedUserInfo = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', session.user.id)
      loggedUserInfo = loggedUserInfo.data[0].username
    }
  } catch (error) {
    return <p>Error! {error}</p>
  }
  /* 
  console.log('loggedUserInfo')
  console.log(loggedUserInfo)
  console.log('profile')
  console.log(profile)
 */
  return (
    <>
      <ProfilePage profile={profile} isMyUser={loggedUserInfo === profile}>
        <NavigationBar hasLoggedIn={true} sessionUsername={loggedUserInfo} />
      </ProfilePage>
    </>
  )
}
