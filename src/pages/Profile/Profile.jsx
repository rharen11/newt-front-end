import { useState, useRef, useEffect } from "react"
import { Navigate, useLocation, useParams } from "react-router-dom"
import styles from './Profile.module.css'
import UserActivity from "../../components/UserActivity/UserActivity"
import { show } from "../../services/profileService"
import * as profileService from '../../services/profileService'
import ProfileApiActivities from "../../components/ProfileApiActivities/ProfileApiActivities"
import ApiActivityCard from "../../components/ApiActivityCard/ApiActivityCard"
import Blob from '../../assets/corner-blob.png'

const Profile = ({user}) => {
  const [validForm, setValidForm] = useState(false)
  const {id} = useParams()
  const formElement = useRef()
  const {state} = useLocation()
  console.log("Profiles are not working", state)
  const [profile, setProfile] = useState()
  const [doneActivities, setDoneActivities] = useState([])
  const [notDoneActivities, setNotDoneActivities] = useState(user?.profile?.activities)

  const [formData, setFormData] = useState({
    activity: '',
    type: '',
    price: 0,
    participants: 0
  })

  useEffect(() => {
    const fetchProfile = async() => {
      const profileData = await show(id)
      setProfile(profileData)
      // set activities based on profiledata.activities
    }
    fetchProfile()
  }, [id])

  const handleDeleteUserActivity = async (userActivityId) => {
    console.log('userActivityId', userActivityId)
    const updatedProfile = await profileService.deleteOne(userActivityId)
    setProfile(updatedProfile)
  }

  const handleUpdateActivity = async (userActivityId) => {
    const updatedProfile = await profileService.update(userActivityId)
    const updatedProfileActivities = profile.activities.map(activity =>
      activity._id === updatedProfile._id ? updatedProfile : activity
      )
      setProfile(updatedProfileActivities)
      Navigate('/profiles/:id')
  }

  useEffect(() => {
    formElement.current?.checkValidity() ? setValidForm(true) : setValidForm(false)
  }, [formData])

  const handleChange = evt => {
		setFormData({ ...formData, [evt.target.name]: evt.target.value })
	}

  const addToDoneActivities = (activity, idx) => {
    setDoneActivities([...doneActivities, activity])
    setNotDoneActivities([...profile.activities.filter((activity, i) => i !== idx)])
    console.log(profile.activities?.filter((activity, i) => {return i !== idx}))
  }

  const handleSubmit = evt => {
    evt.preventDefault()
    handleAddUserActivity(formData)
    setFormData({
      activity: '',
      type: '',
      price: 0
    })
  }

  const handleAddUserActivity = async (newUserActivityData) => {
    const updatedProfile = await profileService.create(newUserActivityData, user.profile)
    setProfile(updatedProfile)
  }

  return ( 
    <>

      
    <main>
    <div className={styles.profilePage}>
    {/* <img className={styles.bgTopBlob} src={Blob} alt="corner blob" /> */}
      <div className={styles.profileBg}>
      {user?.profile === profile?._id ?
        <>
        <div className={styles.greetingAndPic}>
          <div className={styles.profilePicDiv}>
            <img src={profile?.photo} alt="profile-avatar" className={styles.profileAvatar} />
          </div>
          <div className={styles.profileGreeting}>
            <h4 className={styles.profNameh4}>{profile?.name}</h4>
          </div>
        </div>
        <div className={styles.profilePageContents}>
          <div className={styles.colorBarPageContents}>
            <h4 className={styles.ugh}>ugh</h4>
          </div>
          <div className={styles.apiDivs}>
            <div className={styles.apiSavedActivities}>
              <div className={styles.apiHeader}>
                <h4 className={styles.apiH4}>WILL DO</h4>
                {/* {profile?.activities?.map(activity =>
                  <ApiActivityCard
                    key={activity._id} 
                    activity={activity}
                    user={user}
                    profile={profile}
                    addToDoneActivities={addToDoneActivities}
                  />
                )} */}
              </div>
              <ProfileApiActivities profile={profile} addToDoneActivities={addToDoneActivities}/>
            </div>
            <div className={styles.apiDoneActivities}>
              <div className={styles.apiHeaderDone}>

                <h4 className={styles.apiH4Done}>DONE</h4>
                {/* {profile?.doneActivities?.map((activity, idx) =>
                  <ApiActivityCard
                    key={activity._id} 
                    activity={activity}
                    user={user}
                    profile={profile}
                    addToDoneActivities={addToDoneActivities}
                    idx={idx}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* user activity form */}
        <div className={styles.bottomSectionDiv}>
          <div className={styles.colorBarPageContents}>
            <h4 className={styles.ugh}>ugh</h4>
          </div>
          <div className={styles.formAndAddedDiv}>
              <div className={styles.addActivityForm}>
                <div className={styles.h3}>
                  <h3>Add an Activity</h3>
                </div>
                <form 
                  className={styles.formBody}
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
                    <select className={styles.selectType} name="type" id="type" onChange={handleChange} required>
                      <option value=''>Type</option>
                      <option name="query" value="education">Education</option>
                      <option name="recreational" value="recreational">Recreational</option>
                      <option name="social" value="social">Social</option>
                      <option name="diy" value="diy">DIY</option>
                      <option name="charity" value="charity">Charity</option>
                      <option name="cooking" value="cooking">Cooking</option>
                      <option name="relaxation" value="relaxation">Relaxation</option>
                      <option name="music" value="music">Music</option>
                      <option name="busywork" value="busywork">BusyWork</option>
                    </select>
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
              {profile?.userActivity.length? 
              <div className={styles.addedHolder}>
                <div className={styles.addedActivityDiv}>
                <div className={styles.addedHeader}>
                  <h4 className={styles.H4}>{profile?.name}'s Added Activities</h4>
                </div>
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
              :
              <div className={styles.noActivities}>
                <p>Activities you create will appear here, human.</p>
              </div>
              }
          </div>
        </div>
        </>
        :
        <>
        <div className={styles.profileGreeting}>
            <h4>{profile?.name}</h4>
            <img src={profile?.photo} alt="profile-avatar" className={styles.profileAvatar} />
        </div>
        <div className={styles.profilePageContents}>
          <div className={styles.apiDivs}>
            <div className={styles.apiSavedActivities}>
              <div className={styles.apiHeader}>
                <h4 className={styles.apiH4}>Saved Activities</h4>
                {/* {profile?.activities?.map(activity =>
                  <ApiActivityCard
                    key={activity._id} 
                    activity={activity}
                    user={user}
                    profile={profile}
                    addToDoneActivities={addToDoneActivities}
                  />
                )} */}
              </div>
              <ProfileApiActivities profile={profile} addToDoneActivities={addToDoneActivities}/>
            </div>
            <div className={styles.apiDoneActivities}>
              <h4>Done Activities</h4>
              {/* {profile?.doneActivities?.map((activity, idx) =>
                  <ApiActivityCard
                    key={activity._id} 
                    activity={activity}
                    user={user}
                    profile={profile}
                    addToDoneActivities={addToDoneActivities}
                    idx={idx}
                  />
              )} */}
            </div>
          </div>
        </div>
        <div className={styles.addedActivityDiv}>
          {profile?.userActivity?.map(activity =>
            <UserActivity
              key={activity._id} 
              activity={activity}
              profile={profile}
              user={user}
              />
            )}
        </div>
        
        </>
      }
      
      </div>
      
    </div>
    {/* <img className={styles.bgBottomBlob} src={Blob} alt="corner blob" /> */}
    </main>
    
    
    </>
  );
}

export default Profile;