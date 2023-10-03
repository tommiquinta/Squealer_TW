import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PrivateMessagePage from '../../components/messages/PrivateMessagePage'
import NavigationBar from '../../components/layout/Navbar'
export default async function Message ({  params }) {
  const recevierHandle = params.id[0]

  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  var profile = session.user.id
  var loggedUserInfo = null
  var recevier_info = null

  if (profile) {
    loggedUserInfo = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', session?.user.id)
    loggedUserInfo = loggedUserInfo.data[0].username
  }
 

  var receiver_uuid = null
  recevier_info = await supabase
    .from('profiles')
    .select()
    .eq('username', recevierHandle)
  receiver_uuid = recevier_info.data[0].id


  return (
    <PrivateMessagePage
      user_uuid={session.user.id}
      reveiver_uuid={receiver_uuid}
      receiver_handle={recevierHandle}
      recevier_info={recevier_info.data}
    >
      <NavigationBar hasLoggedIn={profile ? true : false} sessionUsername={loggedUserInfo} />
    </PrivateMessagePage>
  )
}