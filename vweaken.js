/** lightweight weaken virus
 * 
 * @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];

	await ns.weaken(target);
	ns.print("Weaken " + target + " completed");
}
