import React, { useState } from 'react';
import { toaster } from 'evergreen-ui';
import { CredentialForm } from './components/CredentialForm';
import { ScoreBox } from './components/ScoreBox';
import { ScoreForm } from './components/ScoreForm';

function App () {
    const [credentials, setCredentials] = useState(loadLocalCredentials());
    const [scoreData, setScoreData] = useState([]);

    function loadLocalCredentials () {
        const localData = JSON.parse(localStorage.getItem('statdriver-mockui')) || {
            url: '',
            getKey: '',
            setKey: '',
        };

        return localData;
    }

    function handleCredentials (c) {
        localStorage.setItem('statdriver-mockui', JSON.stringify(c));
        setCredentials(c);
        reloadScores();
    }

    function sendScore (s) {
        fetch(credentials.url, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': credentials.setKey,
            },
            body: JSON.stringify(s),
        })
            .then(v => {
                v.json()
                    .then(j => {
                        toaster.success('Your are rank #' + j.payload.rank + ' on the scoreboard!');
                        reloadScores();
                    });
            })
            .catch(() => toaster.danger('Failed to send score record to StatDriver!'));
    }

    function reloadScores () {
        fetch(credentials.url, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Authorization': credentials.getKey,
            },
        })
            .then(v => {
                v.json()
                    .then(j => setScoreData(j.payload))
                    .catch(() => toaster.danger('Invalid response from StatDriver!'));
            })
            .catch(() => toaster.danger('Cannot reach StatDriver to reload scores!'));
    }

    return (
        <div style={{ width: 800, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <CredentialForm initCredentials={credentials} onCredentialsChange={handleCredentials} />
            <ScoreForm onRecordSubmit={sendScore} />
            <ScoreBox scores={scoreData} />
        </div>
    );
}

export default App;
