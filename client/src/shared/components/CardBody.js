import React from 'react'
import { Card, Image } from 'react-bootstrap'

function CardBody(props) {
	return (
		<Card.Body
			style={{
				borderBottom: '1px solid #eaeaea',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Image
				style={{ width: '80%' }}
				alt={props.post.description}
				src={props.post.image}
				rounded
			/>
		</Card.Body>
	)
}

export default CardBody
