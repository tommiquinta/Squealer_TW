'use client'

import Card from '../Card'
import moment from 'moment'
import Avatar from '../Avatar'
import Link from 'next/link'
import PostContent from './PostContent'
import { updateView } from '../../../helper/squealsServerActions'
import dynamic from 'next/dynamic'
import { cookies } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PostCard ({ post, children, channelId }) {
  //console.log(post.channel_id)
  const [channelHandle, setChannelHandle] = useState('')

  useEffect(() => {
    async function fetchChannelHandle () {
      if (post?.channel_id) {
        try {
          const response = await supabase
            .from('channels')
            .select('handle')
            .eq('id', post.channel_id)
          setChannelHandle(response.data[0].handle)
        } catch (error) {
          console.error(
            'Errore nel recupero delle informazioni del canale:',
            error
          )
        }
      }
    }

    fetchChannelHandle()
  }, [post])

  const supabase = createClientComponentClient({ cookies })

  const Media = dynamic(() => import('./Media'), { ssr: false })
  const uploads = post?.photos
  var postContent = post.content

  function createMentions (content) {
    const words = content.split(' ')
    const contentWithLinks = words.map((word, index) => {
      if (word.startsWith('§')) {
        const keyword = word.substring(1)

        return `<a href=/channels/${keyword} class="text-blue-500 hover:underline">§${keyword}</a>`
      } else if (word.startsWith('@')) {
        const keyword = word.substring(1)

        return `<a href=/profiles/${keyword} class="text-blue-500 hover:underline">@${keyword}</a>`
      } else if (word.match(/(^|[^"'])(www\..+?\..+?)(\s|$)/)) {
        return replaceWWWLinks(word)
      }
      return word
    })

    return contentWithLinks.join(' ')
  }

  function replaceWWWLinks (content) {
    const linkRegex = /(^|[^"'](www\..+?\..+?)(\s|$))/g
    const contentWithLinks = content.replace(linkRegex, p2 => {
      return `<a class="text-blue-500 hover:underline" href="http://${p2}" target="_blank">${p2}</a>`
    })
    return contentWithLinks
  }
  function increaseViews () {
    updateView(post?.id)
  }
  var color = null

  switch (post.categoria) {
    case 'pop':
      color = 'border-2 border-teal-700/50'
      break
    case 'unpop':
      color = 'border-2 border-red-800/50 '
      break
    case 'contr':
      color = 'border-2 border-blue-600/50'
      break
    default:
      color = null
  }

  return (
    <Card add={color}>
      <div className='flex gap-3'>
        <div>
          <Link href={`/profiles/${post?.username}`}>
            <span className='cursor-pointer'>
              <Avatar url={post?.avatar} />
            </span>
          </Link>
        </div>
        <div className='flex flex-col'>
          <p>
            <Link href={`/profiles/${post?.username}`}>
              <span className='font-semibold hover:underline cursor-pointer mr-1'>
                {post?.username}
              </span>
              shared a squeal
            </Link>
            {channelHandle && (
              <a>
                {' '}
                in{' '}
                <Link href={`/channels/${channelHandle}`} className='text-blue-500 hover:underline'>
                  §{channelHandle}
                </Link>{' '}
              </a>
            )}
          </p>
          <p className='text-gray-500 text-sm'>
            {moment(post?.created_at).fromNow()}
          </p>
        </div>
      </div>

      <div className='my-4'>
        <PostContent callbackFn={increaseViews}>
          <div
            dangerouslySetInnerHTML={{
              __html: createMentions(postContent)
                .replace('https:/', '')
                .replace('http', '')
            }}
          ></div>
        </PostContent>

        {uploads?.length > 0 && (
          <div
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'container'
            }}
            className='w-full h-full rounded-2xl bg-center'
          >
            <Media media={uploads} />
          </div>
        )}
      </div>
      <div className=''>{children}</div>
    </Card>
  )
}
