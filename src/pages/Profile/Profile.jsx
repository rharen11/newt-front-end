import { useState, useRef, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import styles from './Profile.module.css'
import UserActivity from "../../components/UserActivity/UserActivity"
import { show } from "../../services/profileService"

const Profile = ({handleAddUserActivity, handleDeleteUserActivity, user, userActivity}) => {
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
    }
    fetchProfile()
  }, [id])

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

  return ( 
    <>
    <div className={styles.profilePage}>
      <div className={styles.profileBg}>
        <div className={styles.profileGreeting}>
            <h4>Hi, {profile?.name}</h4>
          </div>
        <div className={styles.profilePageContents}>
            <div>
              <h4>Saved Activities</h4>
            </div>
            <div>
              <h4>Done Activities</h4>
            </div>
          </div>
        
        <div className={styles.formAndAddedDiv}>
        <div className={styles.addActivityForm}>
            <h3 className={styles.h3}>Add an Activity</h3>
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
            <div className={styles.addedActivityDiv}>
                {userActivity?.map(activity =>
                  <UserActivity
                  key={activity._id} 
                  activity={activity}
                  handleDeleteUserActivity={handleDeleteUserActivity}
              
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