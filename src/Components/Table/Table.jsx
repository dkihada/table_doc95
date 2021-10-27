import { useEffect, useRef, useState } from 'react';
import styles from './Table.module.css';
import data from '../../Services/data.json';
import ScrollContainer from 'react-indiana-drag-scroll';

function Table() {
	const ref = useRef(null);
	const [state, setState] = useState([]);
	const [search, setSearch] = useState('');

	const allDays = [];

	for (let i = 1; i <= 31; i++) {
		allDays.push(i < 10 ? '05-0' + i : '05-' + i);
	}

	const getTime = (firstDate, secondDate) => {
		let getWorkTime = (string) =>
			new Date(0, 0, 0, string.split(':')[0], string.split(':')[1]);
		let different = getWorkTime(secondDate) - getWorkTime(firstDate);
		let hours = Math.floor((different % 86400000) / 3600000);
		let hour = hours < 10 ? '0' + hours : hours;
		let minutes = Math.round(((different % 86400000) % 3600000) / 60000);
		let mins = minutes < 10 ? '0' + minutes : minutes;
		let result = hour + ':' + mins;

		return result;
	};

	const handleKey = (e) => {
		if (e.key === 'Enter') {
			searchName(search);
		}
	};

	const searchName = (str) => {
		setState(
			data.filter((item) =>
				item.Fullname.toLowerCase().includes(str.toLowerCase())
			)
		);
	};

	useEffect(() => {
		setState(data);
	}, []);

	return (
		<>
			<input
				placeholder='Введите имя для поиска'
				type='text'
				value={search}
				onKeyDown={handleKey}
				onChange={(e) => setSearch(e.target.value)}
				className={styles.input}
			/>
			<div className={styles.table}>
				<span className={styles.user}>
					<span>User</span>
					{state.map((t) => (
						<span key={t.Fullname}>{t.Fullname}</span>
					))}
				</span>

				<span>
					<ScrollContainer
						innerRef={ref}
						className={styles.days}
						activationDistance={50}
						onClick={(e) => {
							if (e.target.classList.value.includes('hour')) {
								window.getSelection().selectAllChildren(e.target);
							}
						}}
					>
						<span className={styles.day}>
							{allDays.map((dat) => (
								<span className={styles.date} key={dat}>
									{dat}
								</span>
							))}
						</span>
						{state.map((t) => (
							<span className={styles.block} key={t.id}>
								<span className={styles.hours}>
									{allDays.map((h) => (
										<span className={styles.hour} key={h}>
											{t.Days.map((d) =>
												h === d.Date.slice(5)
													? getTime(
															d.Start.replace('-', ':'),
															d.End.replace('-', ':')
													  )
													: null
											)}
										</span>
									))}
								</span>
							</span>
						))}
					</ScrollContainer>
				</span>
				<span className={styles.total}>
					<span>Monthly total</span>
					{state.map((t) => (
						<span key={t.id}>Всего часов</span>
					))}
				</span>
			</div>
		</>
	);
}

export { Table };
