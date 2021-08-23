import React from "react";
import _ from "lodash";
import ReactDOM from "react-dom";


export function parseDataAttributes(element) {

	const props = _.chain(Array.from(element.attributes))
		.map((attribute) => [ attribute.name, attribute.value ])
		.fromPairs()
		.mapKeys((value, name) => _.startsWith(name, "data-")
			? _.camelCase(name.replace("data-", ""))
			: null
		)
		.mapValues((value) => {

			try {
				return JSON.parse(atob(value));
			}
			catch (e) {

				return value;
			}
		})
		.omit(null)
		.value();
	return props;
}

export function initializeComponentById(id, component) {

	const Component = component;
	const element = document.getElementById(id);

	if ( ! element ) return null;

	const props = parseDataAttributes(element);

	ReactDOM.render(<Component {...props} />, element);
}
