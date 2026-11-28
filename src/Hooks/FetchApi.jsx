import React, { useEffect, useState } from 'react';

function FetchApi() {

    const [data, setData] = useState([]);

    useEffect(() => {

        fetch('https://jsonplaceholder.typicode.com/users')

            .then(response => response.json())

            .then(result => setData(result))

            .catch(error => console.log(error));

    }, []);

    return (
        <div>
            <h2>API Data</h2>

            {data.map(user => (
                <p key={user.id}>{user.name}</p>
            ))}
        </div>
    );
}

export default FetchApi;