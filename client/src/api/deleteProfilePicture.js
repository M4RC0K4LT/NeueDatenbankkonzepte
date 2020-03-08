/** 
 * Function to request Express Backend and return JSON - Send follow request
 * @param {string} actingUser User´s ID.
 * @param {string} watchedUser Watched User´s ID.
 * @returns {JSON} successful or not.
 */
export default function deleteProfilePicture(){

    return (
        fetch(window.$apiroute + '/user/delProfilePic', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")},
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Following: " + error.message) + '}'))
    )
}