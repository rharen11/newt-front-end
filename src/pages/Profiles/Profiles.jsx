import { useState, useEffect } from 'react'
import * as profileService from '../../services/profileService'
import  styles from './Profiles.module.css'
import { useNavigate } from 'react-router-dom'

const Profiles = (props) => {
  const [profiles, setProfiles] = useState([])
  const navigate = useNavigate()

  const handleClick = (profile) => {
    props.setProfile(profile)
    navigate('/profiles/:id')
  }

  useEffect(()=> {
    const fetchProfiles = async () => {
      const profileData = await profileService.getAllProfiles()
      setProfiles(profileData)
    }
    fetchProfiles()
  }, [])

  return (
    <>
      <div className={styles.communityBg}>
        <div className={styles.communityHeader}>
          <h1 className={styles.newtCommunityH1}>NEWT COMMUNITY</h1>
        </div>
        {profiles.length ? 
          <>
            <div className={styles.cardContainer}>
              {profiles.map(profile=>
                <div key={profile._id}  className={styles.profileNameLink} onClick={()=> handleClick(profile)}>
                  <div className={styles.profileCard}>
                    <div className={styles.profileNameDiv}>
                      <p key={profile._id} profile={profile}>{profile.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </>
        :
          <p>No profiles yet</p>
        }
      </div>
    </>
  )
}

export default Profiles
