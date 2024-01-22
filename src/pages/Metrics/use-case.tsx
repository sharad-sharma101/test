// @ts-nocheck
import React, { useState } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowRight } from "react-icons/ai";
import { Table, List, Button, ListItem } from "@attrybtech/attryb-ui";
import { nFormatter } from "../../utils/helpers";



const column = () => [
	{
		Header: "Use case",
		disableSortBy: true,
		accessor: "usecase",
		align: "left",
		alignHeader: "left",
	},
	{
		Header: "Performance",
		disableSortBy: true,
		accessor: (row) => {
			const performance = row?.performance;
			return (
				<div className="">
					<strong>{nFormatter(performance?.prev)}</strong> <AiOutlineArrowRight />
					<strong>
						{nFormatter(performance?.new)}
					</strong>{" "}
					<span className="">
						{performance?.increasedBy}
					</span>{" "}
					{performance?.status ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
				</div>
			);
		},
		align: "left",
		alignHeader: "left",
	},
]

export default function UseCase() {
	const rows = [
		{
			segment: "Segment 1",
			usecase: "Use case 1",
			performance: {
				prev: 2000,
				new: 4000,
				increasedBy: "50%",
                status:true
			},
		},
		{
			segment: "Segment 2",
			usecase: "Use case 2",
			performance: {
				prev: 2000,
				new: 4000,
				increasedBy: "50%",
                status:true
			},
		},
		{
			segment: "Segment 3",
			usecase: "Use case 3",
			performance: {
				prev: 2000,
				new: 4000,
				increasedBy: "50%",
                status:true
			},
		},
	]

	return (
		<>
			<Table
				Columns={column()}
				tableData={rows}
				enableSort={false}
				showPagination={false}
			/>
		</>
	);
}