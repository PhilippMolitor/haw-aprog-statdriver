import React, { useState } from 'react';
import { Button, Card, Heading, TextInputField } from 'evergreen-ui';
import styles from './CredentialForm.module.css';

export function ScoreForm ({ onRecordSubmit }) {
    const [record, setRecord] = useState({
        name: '',
        score: 0,
    });

    function submit () {
        onRecordSubmit(record);
    }

    return (
        <Card
            elevation={1}
            border
            className={styles.inputbox}
        >
            <Heading className={styles.title}>Record a new score</Heading>

            <TextInputField
                className={styles.field}
                label="Player name"
                placeholder="Pac-Man"
                value={record.name}
                onChange={e => setRecord({ ...record, name: e.target.value })}
            />

            <TextInputField
                className={styles.field}
                label="Score value"
                type="number"
                value={record.score}
                onChange={e => setRecord({ ...record, score: e.target.value })}
            />

            <Button
                onClick={() => submit()}
                appearance="primary"
                iconBefore="confirm"
            >Add Score</Button>
        </Card>
    );
}
