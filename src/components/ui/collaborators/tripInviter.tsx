import { CollaboratorRole, UserSummary } from "../tripComponent";

export interface Collaborator {
    id: number;
    role: CollaboratorRole
    userId: number;
    tripId: number
    user?: UserSummary
}

type TripProps = {
    collaborator: Collaborator
}

export default function TripInviter({collaborator}: TripProps){
    return (
        <div className="ml-2">
            <p className="">{collaborator.user?.name}</p>
        </div>
    )
}