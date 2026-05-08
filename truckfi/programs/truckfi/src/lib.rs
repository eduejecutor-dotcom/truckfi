use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("TrUcKfi1111111111111111111111111111111111111");

#[program]
pub mod truckfi {
    use super::*;

    /// Initialize a TruckFi pool for a specific truck
    pub fn initialize_truck(
        ctx: Context<InitializeTruck>,
        truck_id: u64,
        total_nfts: u64,
        price_per_nft: u64,
    ) -> Result<()> {
        let truck = &mut ctx.accounts.truck;
        truck.authority = ctx.accounts.authority.key();
        truck.truck_id = truck_id;
        truck.total_nfts = total_nfts;
        truck.sold_nfts = 0;
        truck.price_per_nft = price_per_nft;
        truck.total_revenue = 0;
        truck.is_active = true;
        Ok(())
    }

    /// Mint an NFT participation for a truck
    pub fn mint_participation(
        ctx: Context<MintParticipation>,
        truck_id: u64,
    ) -> Result<()> {
        let truck = &mut ctx.accounts.truck;
        require!(truck.is_active, TruckFiError::TruckNotActive);
        require!(truck.sold_nfts < truck.total_nfts, TruckFiError::SoldOut);

        let holder = &mut ctx.accounts.holder;
        holder.owner = ctx.accounts.buyer.key();
        holder.truck_id = truck_id;
        holder.nft_count = 1;
        holder.total_claimed = 0;

        truck.sold_nfts += 1;
        Ok(())
    }

    /// Deposit monthly revenue into the pool (called by operator)
    pub fn deposit_revenue(
        ctx: Context<DepositRevenue>,
        amount: u64,
    ) -> Result<()> {
        let truck = &mut ctx.accounts.truck;
        require!(truck.is_active, TruckFiError::TruckNotActive);

        // Transfer SOL from operator to pool
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.operator.key(),
            &ctx.accounts.revenue_pool.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.operator.to_account_info(),
                ctx.accounts.revenue_pool.to_account_info(),
            ],
        )?;

        truck.total_revenue += amount;
        Ok(())
    }

    /// Claim proportional revenue for an NFT holder
    pub fn claim_revenue(ctx: Context<ClaimRevenue>) -> Result<()> {
        let truck = &ctx.accounts.truck;
        let holder = &mut ctx.accounts.holder;

        // Calculate holder's share: (nft_count / total_nfts) * 95% of revenue
        let holder_pool = truck.total_revenue
            .checked_mul(95).unwrap()
            .checked_div(100).unwrap();

        let claimable = holder_pool
            .checked_mul(holder.nft_count).unwrap()
            .checked_div(truck.total_nfts).unwrap()
            .checked_sub(holder.total_claimed).unwrap();

        require!(claimable > 0, TruckFiError::NothingToClaim);

        // Transfer from pool to holder
        **ctx.accounts.revenue_pool.try_borrow_mut_lamports()? -= claimable;
        **ctx.accounts.holder_wallet.try_borrow_mut_lamports()? += claimable;

        holder.total_claimed += claimable;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTruck<'info> {
    #[account(init, payer = authority, space = 8 + TruckAccount::SIZE)]
    pub truck: Account<'info, TruckAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintParticipation<'info> {
    #[account(mut)]
    pub truck: Account<'info, TruckAccount>,
    #[account(init, payer = buyer, space = 8 + HolderAccount::SIZE)]
    pub holder: Account<'info, HolderAccount>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositRevenue<'info> {
    #[account(mut)]
    pub truck: Account<'info, TruckAccount>,
    #[account(mut)]
    pub operator: Signer<'info>,
    #[account(mut)]
    pub revenue_pool: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct ClaimRevenue<'info> {
    pub truck: Account<'info, TruckAccount>,
    #[account(mut, has_one = owner)]
    pub holder: Account<'info, HolderAccount>,
    pub owner: Signer<'info>,
    #[account(mut)]
    pub revenue_pool: SystemAccount<'info>,
    #[account(mut)]
    pub holder_wallet: SystemAccount<'info>,
}

#[account]
pub struct TruckAccount {
    pub authority: Pubkey,
    pub truck_id: u64,
    pub total_nfts: u64,
    pub sold_nfts: u64,
    pub price_per_nft: u64,
    pub total_revenue: u64,
    pub is_active: bool,
}

impl TruckAccount {
    pub const SIZE: usize = 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

#[account]
pub struct HolderAccount {
    pub owner: Pubkey,
    pub truck_id: u64,
    pub nft_count: u64,
    pub total_claimed: u64,
}

impl HolderAccount {
    pub const SIZE: usize = 32 + 8 + 8 + 8;
}

#[error_code]
pub enum TruckFiError {
    #[msg("Truck is not active")]
    TruckNotActive,
    #[msg("All NFTs have been sold")]
    SoldOut,
    #[msg("Nothing to claim")]
    NothingToClaim,
}
