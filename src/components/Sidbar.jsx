import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import UnAuthenticatedSidbar from './UnAuthenticatedSidbar';
import AuthenticatedSidbar from './AuthenticatedSidbar';

async function Sidbar() {

    const user = await currentUser();

    if(!user) return <UnAuthenticatedSidbar/>
    return (
        <div className='sticky top-20'>
            <AuthenticatedSidbar/>
        </div>
    )
 
}

export default Sidbar