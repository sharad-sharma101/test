// @ts-nocheck
import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowRight } from "react-icons/ai";
import { Table, List, Button, ListItem } from "@attrybtech/attryb-ui";
import { nFormatter } from "../../utils/helpers";


const column = (navigate) => [
	{
		Header: "Segment",
		disableSortBy: true,
		accessor: "segment",
		align: "left",
		alignHeader: "left",
	},
	{
		Header: "Size",
		disableSortBy: true,
		accessor: (row) => <div className="">{nFormatter(row?.size)}</div>,
		align: "left",
		alignHeader: "left",
	},
	{
		Header: "CAC",
		disableSortBy: true,
		accessor: (row) => {
			const metrics = row?.cac;
			return (
				<div className="">
					<strong>{nFormatter(metrics?.prev)}</strong> <AiOutlineArrowRight />
					<strong>
						{nFormatter(metrics?.new)}
					</strong>{" "}
					<span className="">
						{metrics?.increasedBy}
					</span>{" "}
					{metrics?.status ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
				</div>
			);
		},
		align: "left",
		alignHeader: "left",
	},
	{
		Header: "Use cases",
		disableSortBy: true,
		accessor: (row) => (
			<List list={row?.usecases} activeItem={{}} buttonPlaceholder="" selectCallback={() => {}}>
                {row?.usecases.map((item) => {
                    return (
                        <ListItem key={item._id} data={item}>
                            {item.value}
                        </ListItem>
                    )
                })}
            </List>
		),
		align: "left",
		alignHeader: "left",
	},
	{
		Header: "Actions",
		disableSortBy: true,
		width: 240,
		accessor: (row) => (
			<div>
				<Button
					onClick={() => {
						navigate("/use-case")
					}}
					variant="outline"
				>
					View all
				</Button>
			</div>
		),
		alignHeader: "right",
	},
]

export default function Segment() {
	const navigate = useNavigate()
	const rows = [
		{
			segment: "Segment 1",
			size: 4000,
			cac: {
				prev: 2000,
				new: 4000,
				increasedBy: "50%",
                status:true
			},
			usecases:[
                {
                    _id: "Cqr9gHk4dzP5ece4797eaf5e",
                    value: "Use case 1",
                },
                {
                    _id: "Cqr9gHk4dzP5ece4797eaf5f",
                    value: "Use case 2",
                }
            ]
		},
	]

	return (
		<>
			<Table
				Columns={column(navigate)}
				tableData={rows}
				enableSort={false}
				showPagination={false}
			/>
		</>
	);
}