/** 
 * Function to request Express Backend and return JSON - Check if following
 * @param {string} actingUser User´s ID.
 * @param {string} password Watched User´s ID.
 * @returns {JSON} true or false.
 */
export default function postIsFollowing(actingUser, watchedUser){

    return (
        fetch(window.$apiroute + '/user/isfollowing', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "myid": actingUser,
                "otherid": watchedUser
            })
        })
        .then(response => response.json())
        .catch(error => JSON.parse('{"request": "failed", "error":' + JSON.stringify( "Following: " + error.message) + '}'))
    )
}