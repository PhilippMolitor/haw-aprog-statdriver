import React, { useState } from 'react';
import { Card, Table } from 'evergreen-ui';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import styles from './ScoreBox.module.css';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export function ScoreBox ({ scores }) {
    const [filter, setFilter] = useState('');

    return (
        <Card
            elevation={1}
            border
            className={styles.scorebox}
        >
            <Table>
                <Table.Head>
                    <Table.SearchHeaderCell
                        placeholder="Search for player..."
                        value={filter}
                        onChange={v => setFilter(v.toLowerCase())}
                    />
                    <Table.TextHeaderCell>
                        Recorded on
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell>
                        Score
                    </Table.TextHeaderCell>
                </Table.Head>
                <Table.Body>
                    {scores
                        .filter(s => s.name.toLowerCase().includes(filter))
                        .map(s => (
                            <Table.Row key={s.name + '///' + s.time}>
                                <Table.TextCell>{s.name}</Table.TextCell>
                                <Table.TextCell>{timeAgo.format(s.time * 1000)}</Table.TextCell>
                                <Table.TextCell isNumber>
                                    {s.score}
                                </Table.TextCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Card>
    );
}
