'use client'
import LikeButton from './LikeButton.jsx';
import DislikeButton from './DisLikeButton.jsx';
import { useEffect, useState } from 'react';

function Reaction({ numLikes, numDislikes, hasLiked, hasDisliked, disable, addLike, addDislike, removeLike, removeDislike }) {

    //aggiungi e rimuovi like/dislike deve stare in un server component e passare la function alla reaction,
    //posso metterlo nel post ma non so se convenga
    //va passato nella home fino alla reaction, ma devo fare una catena quindi devo vedere se funziona
    const [isLiked, setIsLiked] = useState(hasLiked ? true : false)
    const [isDisliked, setIsDisliked] = useState(hasDisliked ? true : false)
    const [counterLikes, setCounterLikes] = useState(numLikes);
    const [counterDislikes, setCounterDislikes] = useState(numDislikes);

    function handleDislike(toDislike){
        if(toDislike){
            console.log("qui gestisci che deve aggiungere un dislike");
            //aggiungi dislike
            setIsDisliked(true);
            setCounterDislikes(counterDislikes => counterDislikes+1 );
            handleLike(false);
        } else {
            console.log("qui gestisci il fatto che ha tolto il dislike");
            //rimuovi dislike
            if(isDisliked){
                setCounterDislikes(counterDislikes => counterDislikes-1 );
            }
            setIsDisliked(false);
        }
    }

    function handleLike(toLike){
        if(toLike){
            console.log("qui gestisci che deve aggiungere un like");
            //aggiungi like
            setIsLiked(true)
            setCounterLikes(counterLikes => counterLikes+1);
            handleDislike(false)
        } else {
           console.log("qui gestisci il fatto che ha tolto il like");
            //rimuovi like
            if(isLiked){
                setCounterLikes(counterLikes => counterLikes-1);
            }
            setIsLiked(false);
        }
    }

    return (
        <div className='w-full h-[30px] gap-2 flex items-center'>
            <LikeButton
                hasLiked={isLiked}
                handleLikes={handleLike}
                count = {counterLikes} 
                toDisable={disable}
               />
            <DislikeButton
                key={isDisliked}
                hasDisliked={isDisliked}
                handleDislike={handleDislike} 
                count={counterDislikes}
                toDisable={disable}/>
            {/* inserisci views */}
        </div>
    );
}

export default Reaction;
