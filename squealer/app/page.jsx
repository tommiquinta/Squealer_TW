import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthButtonServer from './auth/auth-components/auth-button-server'
import { redirect } from 'next/navigation'
import NewTweet from './new-tweet'
import PostCard from './components/media/PostCard'
import PublicChannelsPost from './components/media/PublicChannelsPost'
import RootLayout from './layout'
import { Inter } from 'next/font/google'
import NavigationBar from './Components/layout/Navbar'
import SideWidget from './Components/layout/SideWidget'

//const inter = Inter({ subsets: ['latin'] })


export default async function Home () {
  // Crea un oggetto supabase utilizzando createServerComponentClient e passa l'oggetto cookies come argomento
  const supabase = createServerComponentClient({ cookies })

  // Ottieni la sessione utente corrente da Supabase
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const hasLoggedIn = session ? true : false;

  // Ottieni tutti i post con dettagli aggiuntivi come profili utente associati e conteggio dei "mi piace"
  var squeals = null;

  const publicSqueals = await supabase.rpc('get_public_only');
  const publicChannelsList = await supabase.rpc('get_public_list');
  if(!hasLoggedIn){
    squeals = publicSqueals;

  } else {
    //TODO: passare il corretto parametro alla funzione
    
    var user = session.user;
  
    squeals = await supabase.rpc('get_posts', {
      user_uuid : user.id
    })
   
    // squeals ora contiene in data un array json con:
    // id, created_at, author, content, photos, 
    // channel_id, likes (ovvero numero dei like per post), dislike (numero dei dislike per post), 
    // hasLiked (boolean true se l'utente ha messo like), hasDisliked (boolean true se l'utente ha messo dislike)
  }


  return (
        
        <RootLayout>  
        <NavigationBar hasLoggedIn={hasLoggedIn} />

         {/* questi non vanno qui <AuthButtonServer /> */} 
          <div className=' ml-2 max-w-4xl gap-4 left-1/4 relative md:ml-0 md:flex md:w-10/12 lg:w-6/12 '>
            <div className={'mx-2 relative top-36 md:top-0 md:mx-0 md:w-full'}>
              {(!hasLoggedIn) && 
                squeals.data.map(publicPost => <PublicChannelsPost key={publicPost.id} post={publicPost} disableReaction={true} /> )
              }
              
              { hasLoggedIn && (
                <div>
                <NewTweet profile={user.user_metadata}/>
                { squeals.data.map(post =>  <PostCard key={post.id} post={post} /> ) }
                </div>)}
            </div>
          </div>
        <div className='left-1/4 relative ml-2'>
          <SideWidget publicChannels={publicChannelsList.data} />
        </div>
        </RootLayout>
  )
}
