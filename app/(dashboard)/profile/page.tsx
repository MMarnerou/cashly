import { Suspense } from 'react'
import { ProfileDetails, ProfileSkeleton } from '@/components/profileDetails'

const ProfilePage = () => {
  return (
    <main className="app-main">
      <div className="app-container">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileDetails />
        </Suspense>
      </div>
    </main>
  )
}
export default ProfilePage
