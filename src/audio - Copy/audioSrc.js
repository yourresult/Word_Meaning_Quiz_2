import BG1 from '../src/audio/bra-B-G.mp3'
import B1 from '../src/audio/cry-no-god-B.mp3'
import B2 from '../src/audio/dekha-aapne-laprwahi-ka-natija-B.mp3'
import B3 from '../src/audio/khatam-tata-by-by-B.mp3'
import B4 from '../src/audio/laud2-B.mp3'
import B5 from '../src/audio/laugh-3-B.mp3'
import B6 from '../src/audio/laugh-B.mp3'
import B7 from '../src/audio/laugh2-B.mp3'
import B8 from '../src/audio/lol-B.mp3'
import B9 from '../src/audio/look-at-this-dood-B.mp3'
import B10 from '../src/audio/no-god-please-no-B.mp3'
import B11 from '../src/audio/socked-B.mp3'
import B12 from '../src/audio/sorry-bro-B.mp3'
import B13 from '../src/audio/weep-cry-B.mp3'
import wait1 from '../src/audio/do-it-just-do-it-wait.mp3'
import wait2 from '../src/audio/few-moments-letter-wait.mp3'
import wait3 from '../src/audio/night-sound-wait.mp3'
import wait4 from '../src/audio/2-hours-leter-wait.mp3'
import BWaiting from '../src/audio/what-happend-B-waiting.mp3'
import GVG1 from '../src/audio/easy-G-VG.mp3'
import GVG2 from '../src/audio/nice-G-VG.mp3'
import GVG3 from '../src/audio/preaty-good-G-VG.mp3'
import G1 from '../src/audio/he-boy-G.mp3'
import G2 from '../src/audio/ok-G.mp3'
import VG1 from '../src/audio/haah-VG.mp3'
import VG2 from '../src/audio/laud-to-haapy-VG.mp3'
import VG3 from '../src/audio/oh-my-god-VG.mp3'
import VG4 from '../src/audio/oh-my-god-wow-VG.mp3'
import VG5 from '../src/audio/wah-kya-seen-hai-VG.mp3'
import VG6 from '../src/audio/wow-VG.mp3'
import BVG1 from '../src/audio/wait-a-min-B-VG.mp3'
import beforeShowResult1 from '../src/audio/bip-sound-before-showing-result.mp3'
import beforeShowResult2 from '../src/audio/result-showing-before-sound.mp3'
import onExit from '../src/audio/why-are-you-running-on-exit.mp3'
import correctAns from '../src/audio/correct-answer.wav'
import wrongAns from '../src/audio/wrong-answer.mp3'

const audioFiles = {
    wait: [wait1,wait2,wait3,wait4,BWaiting],
    bad: [B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,BG1,BVG1,BWaiting],
    good: [G1,G2,BG1,GVG1,GVG2,GVG3],
    veryGood: [VG1,VG2,VG3,VG4,VG5,VG6,BVG1,GVG1,GVG2,GVG3],
    beforeShowResult: [beforeShowResult1,beforeShowResult2],
    onExit,
    correctAns,
    wrongAns
}

export default audioFiles;