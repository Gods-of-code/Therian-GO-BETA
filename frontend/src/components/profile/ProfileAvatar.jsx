import { useState } from "react";


export default function ProfileAvatar({ src }) {
    const [img_error, set_img_error] = useState(false);

    if (!src || img_error) {
        return (
            <div className="profile-avatar avatar-placeholder" />
        );
    }

    return (
        <div className="profile-avatar">
            <img
                src={src}
                alt="Foto de perfil"
                className="avatar-image"
                onError={() => set_img_error(true)}
            />
        </div>
    );


};