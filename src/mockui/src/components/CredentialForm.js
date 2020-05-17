import React, { useState } from 'react';
import { Button, Card, Heading, TextInputField } from 'evergreen-ui';
import styles from './CredentialForm.module.css';

export function CredentialForm ({ initCredentials, onCredentialsChange }) {
    const [credentials, setCredentials] = useState(initCredentials || {
        url: '',
        getKey: '',
        setKey: '',
    });

    function submit () {
        onCredentialsChange(credentials);
    }

    return (
        <Card
            elevation={1}
            border
            className={styles.inputbox}
        >
            <Heading className={styles.title}>Credentials</Heading>

            <div>
                <TextInputField
                    className={styles.field}
                    label="Scoreboard API URL"
                    placeholder="http://statdriver.com/api/scoreboard/..."
                    value={credentials.url}
                    onChange={e => setCredentials({ ...credentials, url: e.target.value })}
                />
            </div>

            <div className={styles.input2}>
                <div className={styles.field}>
                    <TextInputField
                        label="GET key"
                        placeholder="aabbccddee"
                        value={credentials.getKey}
                        onChange={e => setCredentials({ ...credentials, getKey: e.target.value })}
                    />
                </div>
                <div className={styles.field}>
                    <TextInputField
                        label="SET key"
                        placeholder="wwxxyyzz"
                        value={credentials.setKey}
                        onChange={e => setCredentials({ ...credentials, setKey: e.target.value })}
                    />
                </div>
            </div>

            <Button
                onClick={() => submit()}
                appearance="primary"
                iconBefore="refresh"
            >Submit & Refresh</Button>
        </Card>
    );
}
