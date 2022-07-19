import { useState, useRef, useEffect } from "react"
import { Navigate, useLocation, useParams } from "react-router-dom"
import styles from './Profile.module.css'
import UserActivity from "../../components/UserActivity/UserActivity"
import { show } from "../../services/profileService"
import * as profileService from '../../services/profileService'
import ProfileApiActivities from "../../components/ProfileApiActivities/ProfileApiActivities"

const Profile = ({user}) => {
  const [validForm, setValidForm] = useState(false)
  const {id} = useParams()
  const formElement = useRef()
  const {state} = useLocation()
  console.log("Profiles are not working", state)
  const [profile, setProfile] = useState()

  const [formData, setFormData] = useState({
    activity: '',
    type: '',
    price: 0,
    participants: 0
  })

  console.log('profile', profile, 'user', user, 'userid', user._id, 'profileid', profile?._id)



  useEffect(() => {
    const fetchProfile = async() => {
      const profileData = await show(id)
      setProfile(profileData)
      // set activities based on profiledata.activities
    }
    fetchProfile()
  }, [id])

  const handleDeleteUserActivity = async (userActivityId) => {
    console.log(userActivityId)
    const updatedProfile = await profileService.deleteOne(userActivityId)
    setProfile(updatedProfile)
  }

  const handleUpdateActivity = async userActivityId => {
    const updatedProfile = await profileService.update(userActivityId)
    const updatedProfileActivities = profile.activities.map(activity =>
      activity._id === updatedProfile._id ? updatedProfile : activity
      )
      setProfile(updatedProfileActivities)
      Navigate('/profiles/:id')
  }

  useEffect(() => {
    formElement.current.checkValidity() ? setValidForm(true) : setValidForm(false)
  }, [formData])

  const handleChange = evt => {
		setFormData({ ...formData, [evt.target.name]: evt.target.value })
	}

  const handleSubmit = evt => {
    evt.preventDefault()
    handleAddUserActivity(formData)
  }

  const handleAddUserActivity = async (newUserActivityData) => {
    const updatedProfile = await profileService.create(newUserActivityData, user.profile)
    setProfile(updatedProfile)
  }


  return ( 
    <>
      {/* {user === user.id
        ? */}
      <div className={styles.profilePage}>
        <div className={styles.profileBg}>
        <div className={styles.profileGreeting}>
            <h4>Hi, {profile?.name}</h4>
            <img src={profile?.photo} alt="profile-avatar" className={styles.profileAvatar} />
        </div>
        <div className={styles.profilePageContents}>
          <div className={styles.apiDivs}>
            <div className={styles.apiSavedActivities}>
              <div className={styles.apiHeader}>
                <h4 className={styles.apiH4}>Saved Activities</h4>
              </div>
              <ProfileApiActivities profile={profile}/>
            </div>
            <div className={styles.apiDoneActivities}>
              <h4>Done Activities</h4>
            </div>
          </div>
        </div>
        
        <div className={styles.formAndAddedDiv}>
          <div className={styles.formParentDiv}>
            <div className={styles.addActivityForm}>
              <div className={styles.h3}>
                <h3>Add an Activity</h3>
              </div>
              <form 
                autoComplete="off" 
                onSubmit={handleSubmit}
                ref={formElement}>
                <div className={styles.activityProfileInput}>
                  <label htmlFor="activity-name">Activity</label>
                  <input 
                    type="text"
                    className="activity-name"
                    id="name-input"
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.activityProfileInput}>
                  <label htmlFor="activity-type">Type</label>
                  <input 
                    type="text"
                    className="activity-type"
                    id="type-input"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.activityProfileInput}>
                  <label htmlFor="activity-price">Price</label>
                  <input 
                    type="text"
                    className="activity-price"
                    id="price-input"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.activityProfileInput}>
                  <label htmlFor="activity-participants">Participants</label>
                  <input 
                    type="text"
                    className="activity-participants"
                    id="participant-input"
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    />
                </div>
                  <div className={styles.buttonDiv}>
                    <button 
                    className={styles.button6}
                    type="submit"
                    disabled={!validForm}>
                    Add Activity!
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className={styles.addedActivityDiv}>
                {profile?.userActivity?.map(activity =>
                    <UserActivity
                    key={activity._id} 
                    activity={activity}
                    handleDeleteUserActivity={handleDeleteUserActivity}
                    handleUpdateActivity={handleUpdateActivity}
                  />
                  )}
            </div>
        </div>
      </div>
    </div>
        
        </>
  );
}

export default Profile;